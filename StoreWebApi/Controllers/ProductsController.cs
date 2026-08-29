using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreWebApi.Data;
using StoreWebApi.Dtos.Products;
using StoreWebApi.Models;

namespace StoreWebApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductResponse>>> GetProducts(
    [FromQuery] string? search)
    {
        var query = _context.Products.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchTerm = search.Trim();

            query = query.Where(product =>
                product.Name.Contains(searchTerm) ||
                product.Category.Contains(searchTerm));
        }

        var products = await query
            .Select(product => new ProductResponse
            {
                Id = product.Id,
                Name = product.Name,
                Category = product.Category,
                Price = product.Price,
                UnitsInStock = product.UnitsInStock
            })
            .ToListAsync();

        return Ok(products);
    }

    [HttpPost]
    public async Task<ActionResult<ProductResponse>> CreateProduct(
    ProductRequest request)
    {
        var product = new Product
        {
            Name = request.Name.Trim(),
            Category = request.Category.Trim(),
            Price = request.Price,
            UnitsInStock = request.UnitsInStock
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        var response = new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Category = product.Category,
            Price = product.Price,
            UnitsInStock = product.UnitsInStock
        };

        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProductResponse>> UpdateProduct(
    int id,
    ProductRequest request)
    {
        var product = await _context.Products.FindAsync(id);

        if (product is null)
        {
            return NotFound();
        }

        product.Name = request.Name.Trim();
        product.Category = request.Category.Trim();
        product.Price = request.Price;
        product.UnitsInStock = request.UnitsInStock;

        await _context.SaveChangesAsync();

        var response = new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Category = product.Category,
            Price = product.Price,
            UnitsInStock = product.UnitsInStock
        };

        return Ok(response);
    }
}