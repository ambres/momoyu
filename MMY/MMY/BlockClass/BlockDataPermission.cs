using Jupiter.Infrastructure.Permission.DataPermissions;

namespace MMY.BlockClass;

public class BlockDataPermission : IDataPermission
{
    public List<string> GetAuthUserIdList(string? appId, string userId, List<string> values)
    {
        return new List<string>();
    }

    public List<string> GetAuthOrganizationIdList(string? appId, string userId)
    {
        return new List<string>();
    }

    public List<string> GetUserRulerList(string? appId, string code, string userId)
    {
        return new List<string>();
    }

    public IList<dynamic> GetBasicDataPermissionSelectList()
    {
        return new List<dynamic>();
    }

    public IList<dynamic> GetOrganizationTreeList(string? appId)
    {
        return new List<dynamic>();
    }
}