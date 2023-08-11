using System.Reflection;
using Jupiter.Infrastructure.Domain.SqlSugar.Basic;
using Jupiter.Infrastructure.Responses;
using Jupiter.Infrastructure.Summary;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MMY.AppService;
using MMY.AppService.Templates;
using MMY.AppService.Templates.Models;
using MMY.AppService.Templates.Requests;
using MMY.AppService.Templates.Responses;
using MMY.Requests;
using SqlSugar;

namespace MMY.Controllers;

/// <summary>
/// 模版管理
/// </summary>
[ApiController]
[Route("api/[controller]/[action]")]
public class TemplateController : ControllerBase
{
    /// <summary>
    /// 
    /// </summary>
    private readonly ITemplateService _service;

    /// <summary>
    /// 
    /// </summary>
    private readonly IMediator _mediator;


    private readonly IConfiguration _configuration;

    /// <summary>
    /// 
    /// </summary>
    /// <param name="service"></param>
    /// <param name="mediator"></param>
    /// <param name="configuration"></param>
    public TemplateController(ITemplateService service, IMediator mediator, IConfiguration configuration)
    {
        _service = service;
        _mediator = mediator;
        _configuration = configuration;
    }

    /// <summary>
    /// 读取分页列表
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost]
    public async Task<PageResult<GetTemplatePagesResponse>> GetPagesAsync(
        GetTemplatePagesRequest request)
    {
        return await _service.GetPagesAsync(request);
    }

    /// <summary>
    /// 读取信息
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet]
    public async Task<GetTemplateByIdResponse> GetByIdAsync(string id)
    {
        return await _service.GetByIdAsync(id);
    }


    /// <summary>
    /// 新增
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost]
    public async Task<string> PostAsync([FromBody] CreateTemplateRequest request)
    {
        return await _mediator.Send(request);
    }

    /// <summary>
    /// 更新
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPut]
    public async Task<string> PutAsync([FromBody] UpdateTemplateRequest request)
    {
        return await _mediator.Send(request);
    }


    /// <summary>
    /// 创建模版规则
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost]
    public async Task<string> CreateTemplateRuleAsync([FromBody] CreateTemplateRuleRequest request)
    {
        return await _mediator.Send(request);
    }


    /// <summary>
    /// 更新模版规则
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPut]
    public async Task<string> UpdateTemplateRuleAsync([FromBody] UpdateTemplateRuleRequest request)
    {
        return await _mediator.Send(request);
    }


    /// <summary>
    /// 更新模版规则代码
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPut]
    public async Task<string> UpdateTemplateRuleCodeAsync([FromBody] UpdateTemplateRuleCodeRequest request)
    {
        return await _mediator.Send(request);
    }


    /// <summary>
    /// 获取实体信息
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [AllowAnonymous]
    public List<EntitySummary> GetEntitySummary()
    {
        var masterConfig = _configuration.GetConnectionByKeyOrEnv("ConnectionConfig", "CONN_CONFIG");
        var ass = masterConfig.DomainAssembly
            .Select(c => Assembly.Load(c.Assembly))
            .SelectMany(c => c.DefinedTypes)
            .Where(p => p.GetCustomAttributes().Any(c => c.GetType() == typeof(SugarTable)));
        var result = SummaryHelper.GetClassSummary<SugarTable>(ass, (attr) => attr.TableName);
        return result;
    }

    /// <summary>
    /// 预览生成代码
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost]
    [AllowAnonymous]
    public string Preview([FromBody] PreviewCodeRequest request)
    {
        return Jupiter.Infrastructure.CodeGen.Extensions.Preview(request.Code, request.EntitySummary);
    }


    /// <summary>
    /// 获取设置的下拉框
    /// </summary>
    /// <param name="templateId"></param>
    /// <returns></returns>
    [HttpGet]
    public async Task<List<SelectViewModel>> GetSettingSelectViewAsync(string templateId)
    {
        return await _service.GetSettingSelectViewAsync(templateId);
    }


    /// <summary>
    /// 获取单条规则详情
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet]
    public async Task<TemplateSettingModel> GetSettingByIdAsync(string id)
    {
        return await _service.GetSettingById(id);
    }

    /// <summary>
    /// 创建模版设置
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost]
    public async Task<string> CreateTemplateSettingAsync(CreateTemplateSettingRequest request)
    {
        return await _mediator.Send(request);
    }
    
    /// <summary>
    /// 编辑模版设置
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPut]
    public async Task<string> UpdateTemplateSettingAsync(UpdateTemplateSettingRequest request)
    {
        return await _mediator.Send(request);
    }
}