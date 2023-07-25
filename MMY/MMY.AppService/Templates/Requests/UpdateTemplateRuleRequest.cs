using FluentValidation;
using Jupiter.Infrastructure.Domain;
using MediatR;
using MMY.AppService.Templates.Models;

namespace MMY.AppService.Templates.Requests;

/// <summary>
/// 更新模版请求
/// </summary>
public class UpdateTemplateRuleRequest : TemplateRuleModel, IRequest<string>, ITxRequest
{
  
}

/// <summary>
/// 校验
/// </summary>
public class UpdateTemplateRuleRequestValidator : AbstractValidator<UpdateTemplateRuleRequest>
{
    /// <summary>
    /// 
    /// </summary>
    public UpdateTemplateRuleRequestValidator()
    {
        RuleFor(p => p.Id)
            .Must(t => !string.IsNullOrEmpty(t))
            .WithMessage("Id不能为空");


        RuleFor(p => p.Name)
            .Must(name => !string.IsNullOrEmpty(name))
            .WithMessage("Name不能为空");
        RuleFor(p => p.PrefixName)
            .Must(name => !string.IsNullOrEmpty(name))
            .WithMessage("PrefixName不能为空");
        RuleFor(p => p.SuffixName)
            .Must(name => !string.IsNullOrEmpty(name))
            .WithMessage("SuffixName不能为空");
    }
}