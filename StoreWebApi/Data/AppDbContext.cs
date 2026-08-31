using Microsoft.EntityFrameworkCore;
using StoreWebApi.Models;

namespace StoreWebApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>()
            .Property(product => product.Price)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Product>()
            .Property(product => product.Category)
            .HasConversion<string>();

        modelBuilder.Entity<User>()
            .HasIndex(user => user.UserName)
            .IsUnique();
    }
}
