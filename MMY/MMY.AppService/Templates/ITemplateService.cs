using Jupiter.Infrastructure.Responses;
using MMY.AppService.Templates.Models;
using MMY.AppService.Templates.Requests;
using MMY.AppService.Templates.Responses;

namespace MMY.AppService.Templates;

/// <summary>
/// 模版接口
/// </summary>
public interface ITemplateService
{
    /// <summary>
    /// 读取分页列表
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    Task<PageResult<GetTemplatePagesResponse>> GetPagesAsync(
        GetTemplatePagesRequest request);

    /// <summary>
    /// 读取信息
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<GetTemplateByIdResponse> GetByIdAsync(string id);


    /// <summary>
    /// 获取设置的下拉框
    /// </summary>
    /// <param name="templateId"></param>
    /// <returns></returns>
    Task<List<SelectViewModel>> GetSettingSelectViewAsync(string templateId);


    /// <summary>
    /// 获取单条规则详情
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<TemplateSettingModel> GetSettingById(string id);
}