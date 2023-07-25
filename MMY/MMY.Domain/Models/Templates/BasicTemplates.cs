using Jupiter.Infrastructure.Domain;
using SqlSugar;

namespace MMY.Domain.Models.Templates;

/// <summary>
/// 代码模版组
/// </summary>
[SugarTable("BasicTemplates")]
public class BasicTemplates : EntityBase, IAggregateRoot
{
    /// <summary>
    /// 模版组名称
    /// </summary>
    public string Name { get; set; } = "";

    /// <summary>
    /// 描述
    /// </summary>
    public string? Desc { get; set; }


    /// <summary>
    /// 模型请求地址
    /// </summary>
    public string? ApiAddress { get; set; }

    /// <summary>
    /// 模版规则
    /// </summary>
    [Navigate(NavigateType.OneToMany, nameof(BasicTemplateRules.TemplateId))]
    public List<BasicTemplateRules> Rules { get; set; } = new();
}