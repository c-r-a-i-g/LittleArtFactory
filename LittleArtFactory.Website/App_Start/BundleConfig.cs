using System.Web;
using System.Web.Optimization;

namespace LittleArtFactory.Website
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles( BundleCollection bundles )
        {

            bundles.Add( new ScriptBundle( "~/bundles/jquery" ).Include(
                        "~/content/scripts/jquery/jquery-{version}.js",
                        "~/content/scripts/components/jquery.templates.min.js",
                        "~/content/scripts/jquery/jquery.easing.min.js" ) );

            bundles.Add( new ScriptBundle( "~/bundles/jqueryval" ).Include(
                        "~/content/scripts/jquery/jquery.validate*",
                        "~/content/scripts/components/jquery.validate.hooks.js" ) );//,
                        //"~/content/scripts/extensions/gift-rewards.jquery-validate.extensions.js" ) );

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add( new ScriptBundle( "~/bundles/modernizr" ).Include(
                        "~/content/scripts/components/modernizr-*" ) );

            bundles.Add( new ScriptBundle( "~/bundles/bootstrap" ).Include(
                        "~/content/scripts/bootstrap/bootstrap.js",
                        "~/content/scripts/components/respond.js" ) );

            bundles.Add( new StyleBundle( "~/bundles/css" ).Include(
                        "~/content/css/bootstrap/bootstrap.min.css",
                        "~/content/css/bootstrap-components/bootstrap-toggle.min.css",
                        "~/content/css/bootstrap-components/bootstrap-treeview.min.css",
                        "~/content/css/bootstrap-components/bootstrap-daterangepicker.css",
                        "~/content/css/bootstrap-components/bootstrap-select.min.css" ) );

            bundles.Add( new ScriptBundle( "~/bundles/scripts" ).Include(
                        "~/content/scripts/components/datatables-1.10.7.min.js",
                        "~/content/scripts/components/datatables-1.10.7.bootstrap.js",
                        "~/content/scripts/components/datatables-1.10.7.sorting-moment.js",
                        "~/content/scripts/components/jquery.cookie.js",
                        "~/content/scripts/components/jquery.slimscroll.min.js",
                        "~/content/scripts/components/bootstrap-toggle.min.js",
                        "~/content/scripts/components/bootstrap-treeview.min.js",
                        "~/content/scripts/components/bootstrap-select.js",
                        "~/content/scripts/components/moment.min.js",
                        "~/content/scripts/components/bootstrap-daterangepicker.js",
                        "~/content/scripts/components/typeahead.bundle.min.js",
                        "~/content/scripts/components/dropzone.min.js" ) );

            BundleTable.EnableOptimizations = true;

        }
    }
}
