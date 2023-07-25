using MMY.Domain.Enums;

namespace MMY.AppService.Templates.Models;

/// <summary>
/// 模版规则模型
/// </summary>
public class TemplateRuleModel
{
    /// <summary>
    /// 主键
    /// </summary>
    public string? Id { get; set; }

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
    public TransferCaseType TransferCase { get; set; } = TransferCaseType.PascalCase;


    /// <summary>
    /// 模型
    /// </summary>
    public EnumSourceType SourceType { get; set; } = EnumSourceType.Domain;


    /// <summary>
    /// 本地发布路径
    /// </summary>
    public string? LocalPublishPath { get; set; }


    /// <summary>
    /// 代码
    /// </summary>
    public string? Code { get; set; }
}