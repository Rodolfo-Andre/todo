using System.Globalization;

namespace TaskManagement.Application.Common.Interfaces;

public interface ILocalizer
{
    string this[string key] { get; }
    string this[string key, params object[] args] { get; }
    string Get(string key);
    string Get(string key, params object[] args);
    CultureInfo CurrentCulture { get; }
}
