using System.Text;
using System.Text.RegularExpressions;
using Jupiter.Infrastructure.Summary;

namespace Jupiter.Infrastructure.CodeGen.Core;

/// <summary>
/// 循环生成类
/// </summary>
public class ForCodeGenerate : ICodeGenerate
{
    public string Placeholder => Consts.ForEachRegex;

    public string Generate(string code, EntitySummary entitySummary, bool isToCamelCase = false)
    {
        var matches = Regex.Matches(code, Consts.ForEachRegex, RegexOptions.Singleline);

        foreach (Match match in matches)
        {
            if (match.Success)
            {
                // 取出mactch.Value中被FOR:和:END包裹的内容
                var result = match.Value.Substring(match.Value.IndexOf("{{{FOR:", StringComparison.Ordinal) + 7,
                    match.Value.IndexOf(":END}}}", StringComparison.Ordinal) - 7);
                var sb = new StringBuilder();
                foreach (var property in entitySummary.Items)
                {
                    if (isToCamelCase)
                    {
                        sb.AppendLine(result.Replace(Consts.PropName, property.Key.ToCamelCase())
                            .Replace(Consts.PropSummary, property.Name)
                            .Replace(Consts.PropType, "unknown"));
                    }

                    else
                    {
                        sb.AppendLine(result.Replace(Consts.PropName, property.Key)
                            .Replace(Consts.PropSummary, property.Name)
                            .Replace(Consts.PropType, "unknown"));
                    }
                }

                code = code.Replace(match.Value, sb.ToString());
            }
        }


        return code;
    }
}