using Jupiter.Infrastructure.Requests;

namespace MMY.AppService.Templates.Requests;

/// <summary>
/// 获取模版分页
/// </summary>
public class GetTemplatePagesRequest : GetPageRequestBase
{
    /// <summary>
    /// 默认排序
    /// </summary>
    public override string? Sorter { get; set; } = " Created DESC ";
}