using StoreWebApi.Enums;

namespace StoreWebApi.Models;

public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public ProductCategory Category { get; set; }
    public decimal Price { get; set; }
    public int UnitsInStock { get; set; }
}