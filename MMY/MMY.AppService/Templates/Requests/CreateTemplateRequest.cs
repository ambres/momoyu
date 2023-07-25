using FluentValidation;
using Jupiter.Infrastructure.Domain;
using MediatR;
using MMY.AppService.Templates.Models;

namespace MMY.AppService.Templates.Requests;

/// <summary>
/// 创建模版请求
/// </summary>
public class CreateTemplateRequest : TemplateModel, IRequest<string>, ITxRequest
{

}

/// <summary>
/// 校验
/// </summary>
public class CreateTemplateRequestValidator : AbstractValidator<CreateTemplateRequest>
{
    /// <summary>
    /// 
    /// </summary>
    public CreateTemplateRequestValidator()
    {
        RuleFor(p => p.Name)
            .Must(name => !string.IsNullOrEmpty(name))
            .WithMessage("Name不能为空");


        RuleFor(p => p.ApiAddress)
            .Must(t => !string.IsNullOrEmpty(t))
            .WithMessage("ApiAddress不能为空");
    }
}