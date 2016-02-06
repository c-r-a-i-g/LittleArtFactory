using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(LittleArtFactory.Website.Startup))]
namespace LittleArtFactory.Website
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
