using Jupiter.Infrastructure.Summary;

namespace MMY.Requests;

/// <summary>
/// 预览代码请求
/// </summary>
public class PreviewCodeRequest
{
    /// <summary>
    /// 代码
    /// </summary>
    public string Code { get; set; } = "";


    /// <summary>
    /// 注释
    /// </summary>
    public EntitySummary EntitySummary { get; set; } = new();
}