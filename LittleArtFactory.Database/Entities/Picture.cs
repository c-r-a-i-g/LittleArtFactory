using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LittleArtFactory.Database.Entities
{

    [Table( "Picture" )]
    public class Picture
    {

        // --------------------------------------------------------------------------------------------------------

        #region Class Members

        #endregion

        // --------------------------------------------------------------------------------------------------------

        #region Constructor and Intialisation

        public Picture()
        {
            this.PictureId = Guid.NewGuid();
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

        [Key]
        [Required]
        public Guid PictureId { get; set; }

        [Required, MaxLength( 200 )]
        public string Title { get; set; }

        [Required, MaxLength( 100 )]
        public string Collection { get; set; }

        [Required, MaxLength( 255 )]
        public string Path { get; set; }

        [Required]
        public bool IsActive { get; set; }

        [Required]
        [DatabaseGenerated( DatabaseGeneratedOption.Computed )]
        public DateTime DateCreated { get; set; }

        #endregion

        // --------------------------------------------------------------------------------------------------------

        #region Derived Properties

        #endregion

        // --------------------------------------------------------------------------------------------------------

    }
}
