using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class Hex
{
    const float DX = 0.8f;
    const float DY = 0.69f;
    const float H_DX = DX / 2f;
    const float R_DX = 1f / 0.8f;
    const float R_DY = 1f / 0.69f;

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

    public static Vector2 HexToSqr(Hex hex)
    {
        return HexToSqr(hex.x, hex.y);
    }
    public static Vector2 HexToSqr(float x, float y)
    {
        float hexX = x * DX + (y % 2 != 0 ? H_DX : 0f);
        float hexY = y * DY;
        return new Vector2(hexX, hexY);
    }
    public static Hex SqrToHex(Vector2 pos)
    {
        return SqrToHex(pos.x, pos.y);
    }
    public static Hex SqrToHex(float x, float y)
    {
        float sqrY = y * R_DY;
        float sqrX = sqrY % 2 != 0 ? (x - H_DX) * R_DX : x * R_DX;
        return new Hex(sqrX, sqrY);
    }

    /// <summary>
    /// 주어진 position을 육각 타일 좌표에 맞춥니다.
    /// </summary>
    public static Vector2 SnapToTile(Vector2 pos)
    {
        throw new System.NotImplementedException();
        float hexX = (int)(pos.x * R_DX);
        float hexY = (int)(pos.y * R_DY);
        Debug.Log(HexToSqr(hexX, hexY));
        return HexToSqr(hexX, hexY);
    }
}
