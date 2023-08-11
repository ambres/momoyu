using Jupiter.Infrastructure.Domain;
using Newtonsoft.Json;
using SqlSugar;

namespace MMY.Domain.Models.Templates;

/// <summary>
///  模版设定
/// </summary>
[SugarTable("BasicTemplateSettings")]
public class BasicTemplateSettings : EntityBase, IAggregateRoot
{
    /// <summary>
    /// 空构造
    /// </summary>
    public BasicTemplateSettings()
    {
    }

    /// <summary>
    /// 初始化
    /// </summary>
    /// <param name="templateId"></param>
    /// <param name="name"></param>
    /// <param name="localPath"></param>
    /// <param name="settingRules"></param>
    public BasicTemplateSettings(string templateId, string name,
        string localPath, string? settingRules)
    {
        TemplateId = templateId;
        Name = name;
        LocalPath = localPath;
        SettingRules = settingRules;
    }

    /// <summary>
    /// 绑定的模版
    /// </summary>
    public string TemplateId { get; set; } = "";


    /// <summary>
    /// 绑定的模版模型
    /// </summary>
    [Navigate(NavigateType.OneToOne, nameof(TemplateId))]
    public BasicTemplates Template { get; set; } = new();


    /// <summary>
    /// 设定的名称
    /// </summary>
    public string Name { get; set; } = "";


    /// <summary>
    /// 主路径
    /// </summary>
    public string LocalPath { get; set; } = "";


    /// <summary>
    /// 设定
    /// </summary>
    [SugarColumn(ColumnDataType = "longtext")]
    public string? SettingRules { get; set; }

    /// <summary>
    /// 反序列化的规则
    /// </summary>
    [SugarColumn(IsIgnore = true)]
    public List<TemplateSettingRules> Rules => !string.IsNullOrEmpty(SettingRules)
        ? JsonConvert.DeserializeObject<List<TemplateSettingRules>>(SettingRules)!
        : new List<TemplateSettingRules>();
}

/// <summary>
/// 模版设置规则模型
/// </summary>
public class TemplateSettingRules
{
    /// <summary>
    /// 构造函数
    /// </summary>
    /// <param name="ruleKey"></param>
    /// <param name="localPath"></param>
    public TemplateSettingRules(string ruleKey, string localPath)
    {
        RuleKey = ruleKey;
        LocalPath = localPath;
    }

    /// <summary>
    /// 规则id
    /// </summary>
    public string RuleKey { get; set; }


    /// <summary>
    /// 路径
    /// </summary>
    public string LocalPath { get; set; }
}