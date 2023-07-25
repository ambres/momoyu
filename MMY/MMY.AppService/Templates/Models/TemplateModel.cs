namespace MMY.AppService.Templates.Models;

/// <summary>
/// 模版模型
/// </summary>
public class TemplateModel
{


    /// <summary>
    /// 主建
    /// </summary>
    public string? Id { get; set; }

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
}