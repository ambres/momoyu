using Jupiter.Infrastructure.Summary;

namespace Jupiter.Infrastructure.CodeGen;

public interface ICodeGenerate
{
    /// <summary>
    /// 占位符
    /// </summary>
    string Placeholder { get; }


    /// <summary>
    /// 替换生成
    /// </summary>
    /// <param name="code"></param>
    /// <param name="entitySummary"></param>
    /// <param name="isToCamelCase">是否转驼峰</param>
    /// <returns></returns>
    string Generate(string code, EntitySummary entitySummary, bool isToCamelCase = false);
}