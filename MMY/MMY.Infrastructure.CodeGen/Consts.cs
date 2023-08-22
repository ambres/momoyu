namespace MMY.Infrastructure.CodeGen;

/// <summary>
/// 常量
/// </summary>
public class Consts
{
    /// <summary>
    /// 类名占位符
    /// </summary>
    public const string ClassName = "{{{C}}}";

    /// <summary>
    /// 类名注释占位符
    /// </summary>
    public const string ClassSummary = "{{{N}}}";


    /// <summary>
    /// 属性名字占位符
    /// </summary>
    public const string PropName = "{{{LN}}}";
    
    /// <summary>
    /// 属性注释占位符
    /// </summary>
    public const string PropSummary = "{{{LR}}}";

    
    /// <summary>
    /// 属性类型占位符
    /// </summary>
    public const string PropType = "{{{LT}}}";
    /// <summary>
    /// 循环占位符正则
    /// </summary>
    public const string ForEachRegex = @"\{\{\{FOR:.*?:END\}\}\}";
}