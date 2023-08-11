using FluentValidation;
using Jupiter.Infrastructure.Domain;
using MediatR;
using MMY.AppService.Templates.Models;

namespace MMY.AppService.Templates.Requests;

public class UpdateTemplateSettingRequest: TemplateSettingModel, IRequest<string>, ITxRequest
{
  
}

/// <summary>
/// 校验
/// </summary>
public class UpdateTemplateSettingRequestValidator : AbstractValidator<UpdateTemplateSettingRequest>
{
    /// <summary>
    /// 
    /// </summary>
    public UpdateTemplateSettingRequestValidator()
    {
        RuleFor(p => p.Id)
            .Must(t => !string.IsNullOrEmpty(t))
            .WithMessage("Id不能为空");


        RuleFor(p => p.Name)
            .Must(name => !string.IsNullOrEmpty(name))
            .WithMessage("Name不能为空");
   
    }
}