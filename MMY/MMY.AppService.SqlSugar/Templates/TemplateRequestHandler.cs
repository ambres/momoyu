using Jupiter.Infrastructure;
using Jupiter.Infrastructure.Cache.Interfaces;
using Jupiter.Infrastructure.Domain;
using Jupiter.Infrastructure.Domain.SqlSugar;
using Jupiter.Infrastructure.Domain.SqlSugar.Basic;
using Jupiter.Infrastructure.Exceptions;
using Jupiter.Infrastructure.Mappings;
using Jupiter.Infrastructure.Permission;
using Jupiter.Infrastructure.Permission.DataPermissions;
using MediatR;
using Microsoft.Extensions.Configuration;
using MMY.AppService.Templates.Requests;
using MMY.Domain.Models.Templates;
using SqlSugar;

namespace MMY.AppService.SqlSugar.Templates;

/// <summary>
/// 模版请求（操作）
/// </summary>
public class TemplateRequestHandler : RequestHandlerBase<BasicTemplates, string>,
    IRequestHandler<CreateTemplateRequest, string>,
    IRequestHandler<UpdateTemplateRequest, string>,
    IRequestHandler<CreateTemplateRuleRequest, string>,
    IRequestHandler<UpdateTemplateRuleRequest, string>,
    IRequestHandler<UpdateTemplateRuleCodeRequest, string>
{
    /// <summary>
    /// 
    /// </summary>
    private readonly IMapsterMapper _mapper;

    /// <summary>
    /// 
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="securityContextAccessor"></param>
    /// <param name="facadeResolver"></param>
    /// <param name="cacheManager"></param>
    /// <param name="configuration"></param>
    /// <param name="dataPermission"></param>
    /// <param name="mapper"></param>
    public TemplateRequestHandler(ISqlSugarClient dbContext, ISecurityContextAccessor securityContextAccessor,
        IFacadeResolver facadeResolver, ICacheManager cacheManager, IConfiguration configuration,
        IDataPermission? dataPermission, IMapsterMapper mapper) : base(dbContext, securityContextAccessor,
        facadeResolver, cacheManager,
        configuration, dataPermission)
    {
        _mapper = mapper;
    }

    /// <summary>
    /// 创建模版
    /// </summary>
    /// <param name="request"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public async Task<string> Handle(CreateTemplateRequest request, CancellationToken cancellationToken)
    {
        BasicTemplates entity = _mapper.MapTo<BasicTemplates>(request);
        entity.Id = ObjectId.GenerateNewStringId();
        await RegisterNewAsync(entity, cancellationToken);
        return entity.Id!;
    }

    /// <summary>
    /// 修改模版
    /// </summary>
    /// <param name="request"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    public async Task<string> Handle(UpdateTemplateRequest request, CancellationToken cancellationToken)
    {
        // 封装实体对象
        var entity = await Query()
            .Where(p => p.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (entity == null)
        {
            throw new CoreException("找不到记录");
        }

        entity.Name = request.Name;
        entity.Desc = request.Desc;
        entity.ApiAddress = request.ApiAddress;
        // 更新
        RegisterDirty(entity);
        return entity.Id!;
    }

    /// <summary>
    /// 创建模版规则
    /// </summary>
    /// <param name="request"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    public async Task<string> Handle(CreateTemplateRuleRequest request, CancellationToken cancellationToken)
    {
        BasicTemplateRules entity = _mapper.MapTo<BasicTemplateRules>(request);
        entity.Id = ObjectId.GenerateNewStringId();
        await RegisterNewObjectValueAsync(entity, cancellationToken);
        return entity.Id!;
    }

    /// <summary>
    /// 修改模版规则
    /// </summary>
    /// <param name="request"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    public async Task<string> Handle(UpdateTemplateRuleRequest request, CancellationToken cancellationToken)
    {
        // 封装实体对象
        var entity = await Query<BasicTemplateRules>()
            .Where(p => p.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (entity == null)
        {
            throw new CoreException("找不到记录");
        }

        entity.Name = request.Name;
        entity.SuffixName = request.SuffixName;
        entity.PrefixName = request.PrefixName;
        entity.TransferCase = request.TransferCase;
        entity.LocalPublishPath = request.LocalPublishPath;
        // 更新
        RegisterDirtyObjectValue(entity);
        return entity.Id!;
    }

    /// <summary>
    /// 修改模版规则code
    /// </summary>
    /// <param name="request"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    public async Task<string> Handle(UpdateTemplateRuleCodeRequest request, CancellationToken cancellationToken)
    {
        // 封装实体对象
        var entity = await Query<BasicTemplateRules>()
            .Where(p => p.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (entity == null)
        {
            throw new CoreException("找不到记录");
        }

        entity.Code = request.Code;
        // 更新
        RegisterDirtyObjectValue(entity);
        return entity.Id!;
    }
}