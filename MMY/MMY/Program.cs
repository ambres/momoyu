using System.Reflection;
using Jupiter.Infrastructure;
using Jupiter.Infrastructure.Cache.Interfaces;
using Jupiter.Infrastructure.Domain.SqlSugar.Basic;
using Jupiter.Infrastructure.Permission;
using Jupiter.Infrastructure.Permission.DataPermissions;
using Jupiter.Infrastructure.SqlSugar.Unit;
using Jupiter.Infrastructure.Swagger;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.OpenApi.Models;
using MMY.BlockClass;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;
var configuration = builder.Configuration;
var connectionConfig = configuration.GetConnectionByKeyOrEnv("ConnectionConfig", "CONN_CONFIG");

services.AddSingleton<ICacheManager, BlockCacheManager>();
services.AddSingleton<IDistributedCache, BlockCache>();
services.AddScoped<ISecurityContextAccessor, BlockSecurityContextAccessor>();
services.AddScoped<IDataPermission, BlockDataPermission>();

services.AddSugarDataBase(connectionConfig)
    .AddCustomCors(configuration)
    .AddCustomServiceComponent(Assembly.Load("MMY.AppService.SqlSugar"))
    .AddCustomSwaggerGen(new OpenApiInfo()
    {
        Title = "MMY",
        Description = "接口文档"
    });

services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}


// 用于更新master数据库
if (builder.Environment.IsDevelopment() && connectionConfig.UpdateDataBase)
{
    Jupiter.Infrastructure.SqlSugar.Unit.Extensions.UpdateDataBase(new SqlSugarUnitOptions()
    {
        DomainAssembly = connectionConfig.DomainAssembly.Select(c => new UnitDomainAssembly(c.Assembly, c.Folder))
            .ToList(),
        ConnectionString = connectionConfig.ConnectionString!,
        DbType = connectionConfig.DbType,
    });
}

app.UseCustomSwaggerFytApiUi();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();