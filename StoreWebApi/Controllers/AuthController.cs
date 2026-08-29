using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreWebApi.Data;
using StoreWebApi.Dtos.Auth;
using StoreWebApi.Models;
using StoreWebApi.Services;

namespace StoreWebApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly ITokenService _tokenService;

    public AuthController(
        AppDbContext context,
        IPasswordHasher<User> passwordHasher,
        ITokenService tokenService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var userName = request.UserName.Trim();

        var userNameExists = await _context.Users
            .AnyAsync(user => user.UserName == userName);

        if (userNameExists)
        {
            return Conflict("Username already exists.");
        }

        var user = new User
        {
            UserName = userName,
            PasswordHash = string.Empty
        };

        user.PasswordHash = _passwordHasher.HashPassword(
            user,
            request.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return StatusCode(StatusCodes.Status201Created);
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var userName = request.UserName.Trim();

        var user = await _context.Users
            .FirstOrDefaultAsync(user => user.UserName == userName);

        if (user is null)
        {
            return Unauthorized("Invalid username or password.");
        }

        var passwordVerificationResult =
            _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.Password);

        if (passwordVerificationResult == PasswordVerificationResult.Failed)
        {
            return Unauthorized("Invalid username or password.");
        }

        user.LastLogin = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var accessToken = _tokenService.CreateAccessToken(user);

        return Ok(new LoginResponse
        {
            AccessToken = accessToken
        });
    }
}