using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

public class MapManager : MonoBehaviour
{
    public static MapManager instance;
    static readonly int shipTypesCount = System.Enum.GetNames(typeof(Ship.EShip)).Length - 1;

    [Header("◆ Prefabs")]
    [SerializeField]
    private GameObject hexOcean = null;
    [SerializeField]
    private GameObject hexShore = null;
    [SerializeField]
    private GameObject hexIsland = null;
    [SerializeField]
    private GameObject hexLand = null;


    int width, height;
    public Tile.ETile[,] Tiles { get; private set; }
    public int[] ShipCounts { get; private set; } = new int[shipTypesCount];
    public Ship.EShip[,] Ships { get; private set; }

    void Awake()
    {
        if (instance == null) instance = this;
        else Destroy(gameObject);
    }

    public void GenerateMap()
    {
        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                Vector2 pos = Hex.HexToSqr(x, y);
                switch (Tiles[y, x])
                {
                    case Tile.ETile.OCEAN:  // 바다
                        Instantiate(hexOcean, pos, Quaternion.identity, transform);
                        break;
                    case Tile.ETile.SHORE:  // 연안
                        Instantiate(hexShore, pos, Quaternion.identity, transform);
                        break;
                    case Tile.ETile.ISLAND:  // 섬
                        Instantiate(hexIsland, pos, Quaternion.identity, transform);
                        break;
                    case Tile.ETile.LAND:  // 육지
                        Instantiate(hexLand, pos, Quaternion.identity, transform);
                        break;
                    default:
                        throw new System.ComponentModel.InvalidEnumArgumentException();
                }
            }
        }
    }

    public void LoadMap(string path)
    {
        using (StreamReader streamReader = new StreamReader(path))
        {
            string line = streamReader.ReadLine();
            ShipCounts = System.Array.ConvertAll(line.Trim().Split(), s => int.Parse(s));

            line = streamReader.ReadLine();
            int[] wh = System.Array.ConvertAll(line.Trim().Split(), s => int.Parse(s));
            width = wh[0];
            height = wh[1];
            Tiles = new Tile.ETile[height, width];
            Ships = new Ship.EShip[height, width];

            Debug.Log($"Loading map: B{ShipCounts[(int)Ship.EShip.BATTLESHIP]} C{ShipCounts[(int)Ship.EShip.CRUISER]} D{ShipCounts[(int)Ship.EShip.DESTROYER]} {width}X{height}");

            int y = height - 1;
            while ((line = streamReader.ReadLine()) != null)
            {
                int[] vals = System.Array.ConvertAll(line.Trim().Split(), s => int.Parse(s));
                int x = 0;
                foreach (int val in vals)
                {
                    Tiles[y, x] = (Tile.ETile)val;
                    x++;
                }
                y--;
                if (y == -1) break;  // 이후 파일 내용 무시
            }
        }
    }

    public void DecreaseShipCount(Ship.EShip eShip)
    {
        if ((--ShipCounts[(int)eShip]) < 0) throw new System.Exception("※ ShipCount is lower than 0");
        UIManager.instance.UpdateShipCountTexts();
    }
    public void IncreaseShipCount(Ship.EShip eShip)
    {
        ShipCounts[(int)eShip]++;
        UIManager.instance.UpdateShipCountTexts();
    }

    /// <summary>
    /// 위치 hex에 방향 eDirec으로 함선 eShip을 배치할 수 있는지 확인합니다.
    /// </summary>
    public bool CanPlace(Ship.EShip eShip, Hex _hex, Hex.EDirec eDirec)
    {
        Hex hex = new Hex(_hex);  // Clone

        int shipSize = Ship.GetSizeOf(eShip);
        for (int i = 0; i < shipSize; i++)
        {
            if (!IsValidTile(hex))
            {
                Debug.Log("Tile out of bound");
                return false;
            }

            Tile.ETile eTile = Tiles[hex.y, hex.x];
            Debug.Log($"{i}: {hex}, {eTile}");

            if (Ships[hex.y, hex.x] != Ship.EShip.NONE)
            {
                Debug.Log("There is already another ship in the place");
                return false;
            }

            switch (eShip)
            {
                case Ship.EShip.BATTLESHIP:
                case Ship.EShip.CRUISER:
                    if (eTile != Tile.ETile.OCEAN)
                        return false;
                    break;
                case Ship.EShip.DESTROYER:
                    if (eTile != Tile.ETile.OCEAN && eTile != Tile.ETile.SHORE)
                        return false;
                    break;
                default:
                    throw new System.ComponentModel.InvalidEnumArgumentException();
            }
            
            hex.Move(eDirec);  // 방향에 따른 hex 값 조정
        }

        return true;
    }

    /// <summary>
    /// 함선을 Ships 배열에 저장합니다. 유효성 검사를 하지 않으므로 CanPlace를 먼저 수행하세요.
    /// 같은 함종을 더 배치할 수 있으면 참을, 그렇지 않으면 거짓을 반환합니다.
    /// </summary>
    public bool Place(Ship.EShip eShip, Hex _hex, Hex.EDirec eDirec)
    {
        DecreaseShipCount(eShip);

        Hex hex = new Hex(_hex);  // Clone
        int shipSize = Ship.GetSizeOf(eShip);
        for (int i = 0; i < shipSize; i++)
        {
            Ships[hex.y, hex.x] = eShip;
            hex.Move(eDirec);
        }

        return ShipCounts[(int)eShip] > 0;
    }

    public bool IsValidTile(Hex hex)
    {
        return hex.x >= 0 && hex.x < width && hex.y >= 0 && hex.y < height;
    }
}
