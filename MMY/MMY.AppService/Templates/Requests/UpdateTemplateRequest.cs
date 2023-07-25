using FluentValidation;
using Jupiter.Infrastructure.Domain;
using MediatR;
using MMY.AppService.Templates.Models;

namespace MMY.AppService.Templates.Requests;

/// <summary>
/// 更新模版请求
/// </summary>
public class UpdateTemplateRequest : TemplateModel, IRequest<string>, ITxRequest
{

}

/// <summary>
/// 校验
/// </summary>
public class UpdateTemplateRequestValidator : AbstractValidator<UpdateTemplateRequest>
{
    /// <summary>
    /// 
    /// </summary>
    public UpdateTemplateRequestValidator()
    {
        RuleFor(p => p.Id)
            .Must(t => !string.IsNullOrEmpty(t))
            .WithMessage("Id不能为空");


        RuleFor(p => p.Name)
            .Must(name => !string.IsNullOrEmpty(name))
            .WithMessage("Name不能为空");


        RuleFor(p => p.ApiAddress)
            .Must(t => !string.IsNullOrEmpty(t))
            .WithMessage("ApiAddress不能为空");
    }
}