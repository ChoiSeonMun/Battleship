using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InputManager : MonoBehaviour
{
    void Update()
    {
        ClickUp();
        MoveCamera();
    }

    void ClickUp()
    {
        if (Input.GetMouseButtonUp(0))
        {
            Hex hex = Hex.MouseToHex();

            // 타일에는 콜라이더가 있지만 함선에는 없음
            if (hex != null)
            {
                Ship.EShip eShip = MapManager.instance.IsValidTile(hex) ? MapManager.instance.Ships[hex.y, hex.x] : Ship.EShip.NONE;
                Debug.Log($"Clicked {hex}: {eShip}");

                switch (GameManager.instance.Mode)
                {
                    case GameManager.EMode.NONE:
                        break;

                    case GameManager.EMode.PLACE:
                        if (PlaceManager.instance.IsDragging)
                            break;
                        UIManager.instance.PlaceHighlight(hex);
                        if (eShip != Ship.EShip.NONE)
                        {
                            PlaceManager.instance.SelectShip(hex, eShip);
                        }
                        else if (PlaceManager.instance.ChosenEShip != Ship.EShip.NONE)
                        {
                            PlaceManager.instance.DeselectShip();
                        }
                        break;

                    case GameManager.EMode.SELECT:
                        UIManager.instance.SelectHighlight(hex);
                        break;

                    case GameManager.EMode.ATTACK:
                        UIManager.instance.AttackHighlight(hex);
                        break;

                    default:
                        throw new System.ComponentModel.InvalidEnumArgumentException();
                }
            }
            else  // 타일이 없는 공간 클릭
            {
                UIManager.instance.UnhighlightAll();

                switch (GameManager.instance.Mode)
                {
                    case GameManager.EMode.PLACE:
                        PlaceManager.instance.DeselectShip();
                        break;
                }
            }
        }
    }

    void MoveCamera()
    {
        if (Input.GetKey(KeyCode.W))
        {
            CameraMover.instance.Translate(new Vector2(0f, 0.1f));
        }
        else if (Input.GetKey(KeyCode.S))
        {
            CameraMover.instance.Translate(new Vector2(0f, -0.1f));
        }
    }
}
