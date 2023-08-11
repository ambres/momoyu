namespace MMY.AppService;

public class SelectViewModel
{
    /// <summary>
    /// Label
    /// </summary>
    public string? Label { get; set; } = null!;

    /// <summary>
    /// 值
    /// </summary>
    public string Value { get; set; } = null!;

    /// <summary>
    /// 是否禁用
    /// </summary>
    public bool Disabled { get; set; }

    /// <summary>
    /// 扩展
    /// </summary>
    public string? Extend { get; set; }

    /// <summary>
    /// 扩展1
    /// </summary>
    public string? Extend1 { get; set; }
}