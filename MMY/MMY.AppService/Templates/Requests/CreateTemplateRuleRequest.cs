using FluentValidation;
using Jupiter.Infrastructure.Domain;
using MediatR;
using MMY.AppService.Templates.Models;

namespace MMY.AppService.Templates.Requests;

/// <summary>
/// 创建模版规则请求
/// </summary>
public class CreateTemplateRuleRequest : TemplateRuleModel, IRequest<string>, ITxRequest
{
  
}

/// <summary>
/// 校验
/// </summary>
public class CreateTemplateRuleRequestValidator : AbstractValidator<CreateTemplateRuleRequest>
{
    /// <summary>
    /// 
    /// </summary>
    public CreateTemplateRuleRequestValidator()
    {
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