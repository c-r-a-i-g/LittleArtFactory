using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LittleArtFactory.Database.Entities
{

    [Table( "Collection" )]
    public class Collection
    {

        // --------------------------------------------------------------------------------------------------------

        #region Class Members

        #endregion

        // --------------------------------------------------------------------------------------------------------

        #region Constructor and Intialisation

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
        public Guid CollectionId { get; set; }

        [Required, MaxLength( 200 )]
        public string Title { get; set; }

        [Required, MaxLength( 255 )]
        public string Path { get; set; }

        [Required]
        public bool IsActive { get; set; }

        [Required]
        [DatabaseGenerated( DatabaseGeneratedOption.Computed )]
        public DateTime DateCreated { get; set; }

        public virtual ICollection<Picture> Pictures { get; set; }

        #endregion

        // --------------------------------------------------------------------------------------------------------

        #region Derived Properties

        #endregion

        // --------------------------------------------------------------------------------------------------------

    }
}
