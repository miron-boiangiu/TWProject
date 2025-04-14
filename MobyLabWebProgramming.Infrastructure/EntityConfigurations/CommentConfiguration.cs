using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MobyLabWebProgramming.Core.Entities;
using MobyLabWebProgramming.Core.Enums;

namespace MobyLabWebProgramming.Infrastructure.EntityConfigurations;

/// <summary>
/// This is the entity configuration for the User entity, generally the Entity Framework will figure out most of the configuration but,
/// for some specifics such as unique keys, indexes and foreign keys it is better to explicitly specify them.
/// Note that the EntityTypeBuilder implements a Fluent interface, meaning it is a highly declarative interface using method-chaining.
/// </summary>
public class CommentConfiguration : IEntityTypeConfiguration<Comment>
{
    public const int MAX_COMMENT_LENGTH = 4095;

    public void Configure(EntityTypeBuilder<Comment> builder)
    {
        builder.ToTable("Comment");
        builder.Property(e => e.Id) // This specifies which property is configured.
            .IsRequired(); // Here it is specified if the property is required, meaning it cannot be null in the database.
        builder.HasKey(x => x.Id); // Here it is specified that the property Id is the primary key.
        builder.Property(e => e.CreatedAt)
            .IsRequired();
        builder.Property(e => e.UpdatedAt)
            .IsRequired();
        builder.HasOne(e => e.User) // This specifies a one-to-many relation.
        .WithMany() // This provides the reverse mapping for the one-to-many relation. 
        .HasForeignKey(e => e.UserId) // Here the foreign key column is specified.
        .HasPrincipalKey(e => e.Id) // This specifies the referenced key in the referenced table.
        .IsRequired()
        .OnDelete(DeleteBehavior.Cascade); // This specifies the delete behavior when the referenced entity is removed.

        builder.HasOne(e => e.Torrent) // This specifies a one-to-many relation.
        .WithMany() // This provides the reverse mapping for the one-to-many relation. 
        .HasForeignKey(e => e.TorrentId) // Here the foreign key column is specified.
        .HasPrincipalKey(e => e.Id) // This specifies the referenced key in the referenced table.
        .IsRequired()
        .OnDelete(DeleteBehavior.Cascade); // This specifies the delete behavior when the referenced entity is removed.

        builder.Property(e => e.Text)
        .HasMaxLength(MAX_COMMENT_LENGTH)
        .IsRequired(false); // This specifies that this column can be null in the database.
    }
}
