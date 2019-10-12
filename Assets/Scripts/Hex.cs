using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Hex
{
    public int x, y;

    public enum EDirec
    {
        RIGHT = 0,
        RIGHTUP,
        LEFTUP,
        LEFT,
        LEFTDOWN,
        RIGHTDOWN
    }

    const float DX = 0.8f;
    const float DY = 0.69f;
    const float H_DX = DX / 2f;
    const float R_DX = 1f / 0.8f;
    const float R_DY = 1f / 0.69f;

    public Hex(int x, int y)
    {
        this.x = x;
        this.y = y;
    }
    public Hex(Hex hex)
    {
        x = hex.x;
        y = hex.y;
    }
    public override string ToString()
    {
        return $"Hex({x}, {y})";
    }
    public bool Equals(Hex other)
    {
        return x == other.x && y == other.y;
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
        return new Hex((int)sqrX, (int)sqrY);
    }

    public static Hex MouseToHex()
    {
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        RaycastHit2D hit = Physics2D.GetRayIntersection(ray, Mathf.Infinity);

        if (hit.collider != null)
        {
            GameObject obj = hit.collider.gameObject;
            return SqrToHex(obj.transform.position);
        }
        else
        {
            return null;
        }
    }

    /// <summary>
    /// 육각 타일에 맞춘 각도 벡터를 반환합니다. (-150, -120, -60, 0, 60, 120, 180도) transform.right에 대입
    /// </summary>
    public static Vector2 SnapAngle(Vector2 dir, out EDirec eDirec)
    {
        float angle = Vector2.SignedAngle(Vector2.right, dir);
        angle = angle >= 150 ? 180 : angle >= 90 ? 120 : angle >= 30 ? 60 : angle >= -30 ? 0 : angle >= -90 ? -60 : angle >= -150 ? -120 : 180;

        eDirec =
            angle == 0 ? EDirec.LEFT : angle == 60 ? EDirec.LEFTDOWN : angle == 120 ? EDirec.RIGHTDOWN : angle == 180 ? EDirec.RIGHT :
            angle == -120 ? EDirec.RIGHTUP : EDirec.LEFTUP;

        Vector2 res = (Quaternion.Euler(0, 0, angle) * Vector2.right);
        return res;
    }

    /// <summary>
    /// Hex를 주어진 방향으로 한 칸 이동시킵니다.
    /// </summary>
    public void Move(EDirec eDirec)
    {
        switch (eDirec)
        {
            case Hex.EDirec.RIGHT:
                x++;
                break;
            case Hex.EDirec.RIGHTUP:
                y++;
                if (y % 2 == 0) x++;
                break;
            case Hex.EDirec.LEFTUP:
                y++;
                if (y % 2 != 0) x--;
                break;
            case Hex.EDirec.LEFT:
                x--;
                break;
            case Hex.EDirec.LEFTDOWN:
                y--;
                if (y % 2 != 0) x--;
                break;
            case Hex.EDirec.RIGHTDOWN:
                y--;
                if (y % 2 == 0) x++;
                break;
        }
    }
}
