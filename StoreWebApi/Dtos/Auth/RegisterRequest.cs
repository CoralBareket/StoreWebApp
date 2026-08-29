using System.ComponentModel.DataAnnotations;

namespace StoreWebApi.Dtos.Auth;

public class RegisterRequest
{
    [Required]
    public required string UserName { get; set; }

    [Required]
    [MinLength(6)]
    public required string Password { get; set; }
}