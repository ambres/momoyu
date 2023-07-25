using Jupiter.Infrastructure.Attributes;
using Jupiter.Infrastructure.Cache.Interfaces;
using Jupiter.Infrastructure.Domain.SqlSugar;
using Jupiter.Infrastructure.Domain.SqlSugar.Basic;
using Jupiter.Infrastructure.Exceptions;
using Jupiter.Infrastructure.Permission;
using Jupiter.Infrastructure.Permission.DataPermissions;
using Jupiter.Infrastructure.Responses;
using Microsoft.Extensions.Configuration;
using MMY.AppService.Templates;
using MMY.AppService.Templates.Models;
using MMY.AppService.Templates.Requests;
using MMY.AppService.Templates.Responses;
using MMY.Domain.Models.Templates;
using SqlSugar;
using Check = Jupiter.Infrastructure.Check;

namespace MMY.AppService.SqlSugar.Templates;

/// <summary>
/// 模版查询服务
/// </summary>
[ServiceComponent]
public class TemplateAppService : AppServiceQueryBase<BasicTemplates>, ITemplateService
{
    /// <summary>
    /// 构造函数
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="securityContextAccessor"></param>
    /// <param name="configuration"></param>
    /// <param name="cacheManager"></param>
    /// <param name="dataPermission"></param>
    public TemplateAppService(ISqlSugarClient dbContext, ISecurityContextAccessor securityContextAccessor,
        IConfiguration? configuration, ICacheManager cacheManager, IDataPermission? dataPermission) : base(dbContext,
        securityContextAccessor, configuration, cacheManager, dataPermission)
    {
    }

    /// <summary>
    /// 读取分页列表
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    public async Task<PageResult<GetTemplatePagesResponse>> GetPagesAsync(
        GetTemplatePagesRequest request)
    {
        var result = await QueryNoTracking()
            .HasWhere(request.Keyword, p => p.Name.Contains(request.Keyword!))
            .Select<GetTemplatePagesResponse>()
            .ToPageAsync(request);
        return result;
    }

    /// <summary>
    /// 读取信息
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public async Task<GetTemplateByIdResponse> GetByIdAsync(string id)
    {
        var result = await QueryNoTracking()
            .Where(p => p.Id == id)
            .Select<GetTemplateByIdResponse>()
            .FirstOrDefaultAsync();

        Check.Validate<CoreException>(result == null, "未找到对应数据！");

        if (result != null)
        {
            result.Rules = await QueryNoTracking<BasicTemplateRules>()
                .Where(p => p.TemplateId == id)
                .Select<TemplateRuleModel>()
                .ToListAsync();
        }

        return result ?? new GetTemplateByIdResponse();
    }
}