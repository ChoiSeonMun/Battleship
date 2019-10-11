using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class Hex
{
    public float x, y;

    public Hex(float x, float y)
    {
        this.x = x;
        this.y = y;
    }
    public override string ToString()
    {
        return $"Hex({x}, {y})";
    }

    public static Vector2 HexToSqr(Vector2 pos)
    {
        return HexToSqr(pos.x, pos.y);
    }
    public static Vector2 HexToSqr(float x, float y)
    {
        float hexX = x * 0.8f + (y % 2 != 0 ? 0.4f : 0f);
        float hexY = y * 0.69f;
        Vector2 res = new Vector2(hexX, hexY);
        return res;
    }
    public static Hex SqrToHex(Vector2 pos)
    {
        return SqrToHex(pos.x, pos.y);
    }
    public static Hex SqrToHex(float x, float y)
    {
        float sqrY = y / 0.69f;
        float sqrX = sqrY % 2 != 0 ? (x - 0.4f) / 0.8f : x / 0.8f;
        Hex res = new Hex(sqrX, sqrY);
        return res;
    }
}
