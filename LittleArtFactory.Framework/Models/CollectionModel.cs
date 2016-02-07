using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LittleArtFactory.Database;
using LittleArtFactory.Database.Entities;

namespace LittleArtFactory.Framework.Models
{
    public class CollectionModel
    {

        // --------------------------------------------------------------------------------------------------------

        #region Class Members

        #endregion

        // --------------------------------------------------------------------------------------------------------

        #region Constructor and Intialisation

        public CollectionModel( string title, List<Picture> pictures )
        {
            this.Title = title;
            this.Pictures = pictures;
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

        public string Title { get; set; } = "";
        public List<Picture> Pictures { get; set; } = new List<Picture>();

        #endregion

        // --------------------------------------------------------------------------------------------------------

        #region Derived Properties

        #endregion

        // --------------------------------------------------------------------------------------------------------

    }
}
