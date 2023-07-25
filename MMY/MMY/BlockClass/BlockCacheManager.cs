using Jupiter.Infrastructure.Cache.Interfaces;

namespace MMY.BlockClass;

public class BlockCacheManager:ICacheManager
{
    public void Set(string key, byte[] bytes)
    {
        throw new NotImplementedException();
    }

    public async Task SetAsync(string key, byte[] bytes)
    {
        throw new NotImplementedException();
    }

    public void Set(string key, byte[] bytes, TimeSpan timeSpan)
    {
        throw new NotImplementedException();
    }

    public async Task SetAsync(string key, byte[] bytes, TimeSpan timeSpan)
    {
        throw new NotImplementedException();
    }

    public void Set<TItem>(string key, TItem data)
    {
        throw new NotImplementedException();
    }

    public async Task SetAsync<TItem>(string key, TItem data)
    {
        throw new NotImplementedException();
    }

    public void Set<TItem>(string key, TItem data, TimeSpan timeSpan)
    {
        throw new NotImplementedException();
    }

    public async Task SetAsync<TItem>(string key, TItem data, TimeSpan timeSpan)
    {
        throw new NotImplementedException();
    }

    public void SetString(string key, string data)
    {
        throw new NotImplementedException();
    }

    public async Task SetStringAsync(string key, string data)
    {
        throw new NotImplementedException();
    }

    public void SetString(string key, string data, TimeSpan timeSpan)
    {
        throw new NotImplementedException();
    }

    public async Task SetStringAsync(string key, string data, TimeSpan timeSpan)
    {
        throw new NotImplementedException();
    }

    public TItem? GetOrCreate<TItem>(string key, Func<TItem> factory, TimeSpan timeSpan)
    {
        throw new NotImplementedException();
    }

    public async Task<TItem?> GetOrCreateAsync<TItem>(string key, Func<Task<TItem>> factory, TimeSpan timeSpan)
    {
        throw new NotImplementedException();
    }

    public TItem? GetOrCreate<TItem>(string key, Func<TItem> factory)
    {
        throw new NotImplementedException();
    }

    public async Task<TItem?> GetOrCreateAsync<TItem>(string key, Func<Task<TItem>> factory)
    {
        throw new NotImplementedException();
    }

    public bool TryGetValue<TItem>(string key, out TItem? val)
    {
        throw new NotImplementedException();
    }

    public bool IsSet(string key)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> IsSetAsync(string key)
    {
        throw new NotImplementedException();
    }

    public T? Get<T>(string key)
    {
        throw new NotImplementedException();
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        throw new NotImplementedException();
    }

    public string? GetString(string key)
    {
        throw new NotImplementedException();
    }

    public async Task<string?> GetStringAsync(string key)
    {
        throw new NotImplementedException();
    }

    public byte[]? Get(string key)
    {
        throw new NotImplementedException();
    }

    public async Task<byte[]?> GetAsync(string key)
    {
        throw new NotImplementedException();
    }

    public void Remove(string key)
    {
        throw new NotImplementedException();
    }

    public async Task RemoveAsync(string key)
    {
        throw new NotImplementedException();
    }
}