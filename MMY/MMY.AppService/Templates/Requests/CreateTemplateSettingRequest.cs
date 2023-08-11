using FluentValidation;
using Jupiter.Infrastructure.Domain;
using MediatR;
using MMY.AppService.Templates.Models;

namespace MMY.AppService.Templates.Requests;

public class CreateTemplateSettingRequest : TemplateSettingModel, IRequest<string>, ITxRequest
{
}

/// <summary>
/// 校验
/// </summary>
public class CreateTemplateSettingRequestValidator : AbstractValidator<CreateTemplateSettingRequest>
{
    /// <summary>
    /// 
    /// </summary>
    public CreateTemplateSettingRequestValidator()
    {
        RuleFor(p => p.Name)
            .Must(name => !string.IsNullOrEmpty(name))
            .WithMessage("Name不能为空");
    }
}