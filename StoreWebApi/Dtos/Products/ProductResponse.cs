using StoreWebApi.Enums;

namespace StoreWebApi.Dtos.Products;

public class ProductResponse
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public ProductCategory Category { get; set; }
    public decimal Price { get; set; }
    public int UnitsInStock { get; set; }
}