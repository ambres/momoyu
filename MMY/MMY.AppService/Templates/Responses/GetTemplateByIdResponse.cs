using MMY.AppService.Templates.Models;

namespace MMY.AppService.Templates.Responses;

/// <summary>
/// 获取单条信息返回值
/// </summary>
public class GetTemplateByIdResponse : TemplateModel
{
    /// <summary>
    /// 规则
    /// </summary>
    public List<TemplateRuleModel> Rules { get; set; } = new();
}