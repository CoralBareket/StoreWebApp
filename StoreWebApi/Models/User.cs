using System.Data;

namespace StoreWebApi.Models;

public class User
{
    public int Id { get; set; }
    public required string UserName { get; set; }
    public required string PasswordHash { get; set; }
    public DataSetDateTime? LastLogin { get; set; }
}