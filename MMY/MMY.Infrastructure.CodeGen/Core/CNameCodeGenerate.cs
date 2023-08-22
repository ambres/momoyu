using Jupiter.Infrastructure.Summary;

namespace MMY.Infrastructure.CodeGen.Core;

public class CNameCodeGenerate : ICodeGenerate
{
    /// <summary>
    /// 占位符
    /// </summary>
    public string Placeholder => Consts.ClassName;

    public string Generate(string code, EntitySummary entitySummary, bool isToCamelCase = false)
    {
        if (isToCamelCase)
        {
            return code.Replace(Placeholder, entitySummary.Name.ToCamelCase());
        }

        return code.Replace(Placeholder, entitySummary.Key);
    }
}