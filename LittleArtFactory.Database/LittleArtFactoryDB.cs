using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LittleArtFactory.Database.Entities;

namespace LittleArtFactory.Database
{
    public class LittleArtFactoryDB : DbContext
    {

        /* ----------------------------------------------------------------------------------------------------------------------------------------- */

        #region Class Members

        #endregion

        /* ----------------------------------------------------------------------------------------------------------------------------------------- */

        #region Constructor & Intialisation

        public LittleArtFactoryDB() : base( "LittleArtFactoryDB" ) 
        {

            base.Configuration.LazyLoadingEnabled = true;

            //var objectContext = ( (IObjectContextAdapter)this ).ObjectContext;
            //objectContext.ObjectMaterialized += ( sender, e ) =>
            //{
            //    if( e.Entity is IOnMaterialise )
            //    {
            //        ( e.Entity as IOnMaterialise ).OnMaterialise();
            //    }
            //};

        }

        #endregion

        /* ----------------------------------------------------------------------------------------------------------------------------------------- */

        #region Tables


        /* -----------------------------------------------
         * Pictures
         */
        public DbSet<Collection> Collections { get; set; }
        public DbSet<Picture> Pictures { get; set; }

        #endregion

        /* ----------------------------------------------------------------------------------------------------------------------------------------- */

        #region Public Methods

        #endregion

        /* ----------------------------------------------------------------------------------------------------------------------------------------- */

        #region Protected Methods

        protected override void OnModelCreating( DbModelBuilder modelBuilder )
        {

            //modelBuilder.Entity<Group>()
            //            .HasOptional( c => c.ParentGroup )
            //            .WithMany()
            //            .HasForeignKey( c => c.ParentGroupId );

            //modelBuilder.Entity<Group>()
            //            .HasMany( e => e.Groups )
            //            .WithOptional( m => m.ParentGroup );

            //modelBuilder.Entity<Group>()
            //            .HasOptional( e => e.DomainGroup )
            //            .WithMany()
            //            .HasForeignKey( m => m.DomainGroupId );

            //modelBuilder.Entity<DomainSetting>()
            //            .HasMany( c => c.Groups )
            //            .WithRequired( c => c.Settings );

            //modelBuilder.Entity<Group>()
            //            .HasMany( g => g.GroupRewards )
            //            .WithRequired( gm => gm.Group );

            //modelBuilder.Entity<Reward>()
            //            .HasMany( g => g.GroupRewards )
            //            .WithRequired( gm => gm.Reward );

            //modelBuilder.Entity<Customer>()
            //            .HasOptional( e => e.ReferredByCustomer )
            //            .WithMany()
            //            .HasForeignKey( m => m.ReferredByCustomerId );

            //modelBuilder.Entity<Customer>()
            //            .HasMany( e => e.Referrals )
            //            .WithOptional( m => m.ReferredByCustomer );

            //modelBuilder.Entity<GiftOrder>()
            //            .HasMany( e => e.History )
            //            .WithRequired( m => m.GiftOrder );

            //modelBuilder.Entity<User>()
            //            .HasMany( g => g.GiftOrders )
            //            .WithOptional( go => go.AccountManager );

            //modelBuilder.Entity<User>()
            //            .HasMany( u => u.AccountManagerGroups )
            //            .WithOptional( g => g.AccountManager );

        }

        /// <summary>
        /// Whenever an entity is added or modified, check to see if it implements OnBeforeSave, and if
        /// it does, call its OnBeforeSave function
        /// </summary>
        /// <returns></returns>
        public override int SaveChanges()
        {

            //var entities = ChangeTracker.Entries<IOnBeforeSave>()
            //                            .Where( p => p.State == EntityState.Added || p.State == EntityState.Modified || p.State == EntityState.Unchanged )
            //                            .Select( p => p.Entity )
            //                            .Cast<IOnBeforeSave>();

            //foreach( var entity in entities )
            //{
            //    entity.OnBeforeSave();
            //}

            return base.SaveChanges();

        }

        #endregion

        /* ----------------------------------------------------------------------------------------------------------------------------------------- */

        #region Static Methods

        #endregion

        /* ----------------------------------------------------------------------------------------------------------------------------------------- */

        #region Private Methods

        #endregion

        /* ----------------------------------------------------------------------------------------------------------------------------------------- */

        #region Properties

        #endregion

        /* ----------------------------------------------------------------------------------------------------------------------------------------- */

        #region Derived Properties

        #endregion

        /* ----------------------------------------------------------------------------------------------------------------------------------------- */

    }
}
