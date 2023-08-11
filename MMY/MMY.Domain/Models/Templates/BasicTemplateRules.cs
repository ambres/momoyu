using Jupiter.Infrastructure.Domain;
using MMY.Domain.Enums;
using SqlSugar;

namespace MMY.Domain.Models.Templates;

/// <summary>
/// 模版规则
/// </summary>
[SugarTable("BasicTemplateRules")]
public class BasicTemplateRules : ValueObjectBase
{
    /// <summary>
    /// 所属模版ID
    /// </summary>
    public string TemplateId { get; set; } = "";

    /// <summary>
    /// 模版规则名称
    /// </summary>
    public string Name { get; set; } = "";

    /// <summary>
    /// 前缀名称
    /// </summary>
    public string PrefixName { get; set; } = "";

    /// <summary>
    /// 后缀 eg .jsx
    /// </summary>
    public string SuffixName { get; set; } = "";


    /// <summary>
    /// 是否英文
    /// </summary>
    public TransferCaseType TransferCase { get; set; }


    /// <summary>
    /// 模型
    /// </summary>
    public EnumSourceType SourceType { get; set; }


    /// <summary>
    /// 代码
    /// </summary>
    [SugarColumn(ColumnDataType = "longtext")]
    public string? Code { get; set; }
}