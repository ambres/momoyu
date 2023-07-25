using FluentValidation;
using Jupiter.Infrastructure.Domain;
using MediatR;

namespace MMY.AppService.Templates.Requests;

/// <summary>
/// 修改模版规则代码请求
/// </summary>
public class UpdateTemplateRuleCodeRequest : IRequest<string>, ITxRequest
{
    /// <summary>
    /// id
    /// </summary>
    public string Id { get; set; }


    /// <summary>
    /// 代码
    /// </summary>
    public string Code { get; set; }
}

/// <summary>
/// 校验
/// </summary>
public class UpdateTemplateRuleCodeRequestValidator : AbstractValidator<UpdateTemplateRuleCodeRequest>
{
    /// <summary>
    /// 
    /// </summary>
    public UpdateTemplateRuleCodeRequestValidator()
    {
        RuleFor(p => p.Id)
            .Must(name => !string.IsNullOrEmpty(name))
            .WithMessage("Id不能为空");
        RuleFor(p => p.Code)
            .Must(name => !string.IsNullOrEmpty(name))
            .WithMessage("Code不能为空");
    }
}