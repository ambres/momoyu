namespace MMY.AppService.Templates.Models;

public class TemplateSettingModel
{
    
    /// <summary>
    /// 主键
    /// </summary>
    public string? Id { get; set; }

    /// <summary>
    /// 绑定的模版
    /// </summary>
    public string TemplateId { get; set; } = "";


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
    public string? SettingRules { get; set; }
}