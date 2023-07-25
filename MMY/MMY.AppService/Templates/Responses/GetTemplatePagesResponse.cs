namespace MMY.AppService.Templates.Responses;

/// <summary>
/// 分页返回值
/// </summary>
public class GetTemplatePagesResponse
{
    /// <summary>
    /// 主建
    /// </summary>
    public string? Id { get; set; }

    /// <summary>
    /// 模版组名称
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 描述
    /// </summary>
    public string? Desc { get; set; }


    /// <summary>
    /// 模型请求地址
    /// </summary>
    public string? ApiAddress { get; set; }

    /// <summary>
    /// 创建时间
    /// </summary>
    public DateTime Created { get; set; }
}