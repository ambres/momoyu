using Jupiter.Infrastructure.CodeGen.Core;
using Jupiter.Infrastructure.Summary;

namespace Jupiter.Infrastructure.CodeGen;

/// <summary>
/// 代码生成扩展
/// </summary>
public static class Extensions
{
    public static readonly List<ICodeGenerate> CodeGenerates = new()
    {
        new CNameCodeGenerate(),
        new CSummaryCodeGenerate(),
        new ForCodeGenerate()
    };


    /// <summary>
    /// 转驼峰
    /// </summary>
    /// <param name="name"></param>
    /// <returns></returns>
    public static string ToCamelCase(this string name)
    {
        return char.ToLower(name[0]) + name.Substring(1);
    }

    /// <summary>
    /// 预览
    /// </summary>
    /// <param name="code"></param>
    /// <param name="entitySummary"></param>
    /// <param name="isToCamelCase">是否转驼峰</param>
    /// <returns></returns>
    public static string Preview(string code, EntitySummary entitySummary, bool isToCamelCase = false)
    {
        var result = code;
        foreach (var codeGen in CodeGenerates)
        {
            code = codeGen.Generate(code, entitySummary, isToCamelCase);
        }

        return code;
    }
}