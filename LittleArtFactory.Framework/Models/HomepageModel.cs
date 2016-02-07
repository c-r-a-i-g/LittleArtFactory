using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LittleArtFactory.Database;
using LittleArtFactory.Database.Entities;

namespace LittleArtFactory.Framework.Models
{
    public class HomepageModel
    {

        // --------------------------------------------------------------------------------------------------------

        #region Class Members

        #endregion

        // --------------------------------------------------------------------------------------------------------

        #region Constructor and Intialisation

        public HomepageModel()
        {

            var db = new LittleArtFactoryDB();
            this.Collections = db.Collections.Where( x => x.IsActive && x.Pictures.Count() > 0 ).ToList();

        }

        #endregion

        // --------------------------------------------------------------------------------------------------------

        #region Public Methods

        #endregion

        // --------------------------------------------------------------------------------------------------------

        #region Private Methods

        #endregion

        // --------------------------------------------------------------------------------------------------------

        #region Static Methods

        #endregion

        // --------------------------------------------------------------------------------------------------------

        #region Properties

        public List<Collection> Collections { get; set; } = new List<Collection>();

        #endregion

        // --------------------------------------------------------------------------------------------------------

        #region Derived Properties

        #endregion

        // --------------------------------------------------------------------------------------------------------

    }
}
