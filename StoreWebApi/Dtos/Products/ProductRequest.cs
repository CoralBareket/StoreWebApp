using System.ComponentModel.DataAnnotations;
using StoreWebApi.Enums;

namespace StoreWebApi.Dtos.Products;

public class ProductRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    public ProductCategory Category { get; set; }

    [Range(typeof(decimal), "0", "999999999")]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int UnitsInStock { get; set; }
}