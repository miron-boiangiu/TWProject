using Ardalis.EFCore.Extensions;
using Microsoft.EntityFrameworkCore;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Infrastructure.Database;

/// <summary>
/// This is the database context used to connect with the database and links the ORM, Entity Framework, with it.
/// </summary>
public sealed class WebAppDatabaseContext : DbContext
{
    public DbSet<Like> Like { get; set; }
    public DbSet<Comment> Comment { get; set; }

    public WebAppDatabaseContext() { }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql("Server=localhost;Port=5432;Database=mobylab-app;User Id=mobylab-app;Password=mobylab-app;");
    }

    public WebAppDatabaseContext(DbContextOptions<WebAppDatabaseContext> options, bool migrate = true) : base(options)
    {
        if (migrate)
        {
            Database.Migrate();
        }
    }

    public WebAppDatabaseContext(DbContextOptions<WebAppDatabaseContext> options) : base(options)
    {
        Database.Migrate();
    }

    /// <summary>
    /// Here additional configuration for the ORM is performed.
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.HasPostgresExtension("unaccent")
            .ApplyAllConfigurationsFromCurrentAssembly(); // Here all the classes that contain implement IEntityTypeConfiguration<T> are searched at runtime
                                                          // such that each entity that needs to be mapped to the database tables is configured accordingly.
    }
}