using Jupiter.Infrastructure.Summary;

namespace MMY.Infrastructure.CodeGen.Core;

public class CSummaryCodeGenerate : ICodeGenerate
{
    public string Placeholder => Consts.ClassSummary;

    public string Generate(string code, EntitySummary entitySummary,bool isToCamelCase = false )
    {
        return code.Replace(Placeholder, entitySummary.Name);
    }
}