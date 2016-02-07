using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LittleArtFactory.Framework.Models;

namespace LittleArtFactory.Framework.Controllers
{
    public class HomeController : Controller
    {

        [Route( "" )]
        public ActionResult Homepage()
        {
            var model = new HomepageModel();
            return View( model );
        }

        [Route( "about" )]
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        [Route( "contact" )]
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}